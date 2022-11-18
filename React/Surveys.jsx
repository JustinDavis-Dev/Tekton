import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Button, ButtonGroup } from 'react-bootstrap';
import './surveys.css';
import Survey from './Survey';
import SurveysData from './SurveysData';
import surveysService from '../../services/surveysService';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import locale from 'rc-pagination/lib/locale/en_US';
import toastr from 'toastr';
import SurveysSearch from './SurveysSearch';
import debug from 'sabio-debug';

const _logger = debug.extend('Surveys');

function Surveys() {
    const [pageData, setPageData] = useState({
        surveys: [],
        surveyComponents: [],
        pagination: { current: 1, pageSize: 8, total: 0 },
        surveysData: { update: 0 },
        formData: { query: '' },
        selectCategory: { name: 'getCreatedBy', id: '' },
    });

    useEffect(() => {
        handleServiceCalls(1);
    }, [pageData.selectCategory.name, pageData.pagination.pageSize]);

    const mapSurvey = (aSurvey, idx) => {
        return <Survey survey={aSurvey} toggleStatus={handleToggleStatus} key={'Survey-' + idx} />;
    };

    const onPagChange = (page) => {
        handleServiceCalls(page);
    };

    const handleCategoryChange = (e, id) => {
        let catName = null;
        let catId = null;
        if (typeof e === 'object') {
            catName = e.target.value;
        } else {
            catName = e;
            catId = id;
        }
        setPageData((prevState) => {
            const ps = { ...prevState };
            ps.selectCategory.name = catName;
            ps.selectCategory.id = catId;
            return ps;
        });
    };

    const handleServiceCalls = (page) => {
        if (pageData.selectCategory.name === 'search') {
            surveysService
                .search(page - 1, pageData.pagination.pageSize, pageData.formData.query)
                .then(onGetSurveySuccess)
                .catch(onGetSurveyError);
        } else if (pageData.selectCategory.name === 'getCreatedBy') {
            surveysService
                .getCreatedBy(page - 1, pageData.pagination.pageSize)
                .then(onGetSurveySuccess)
                .catch(onGetSurveyError);
        } else if (pageData.selectCategory.name === 'getAll') {
            surveysService
                .getAll(page - 1, pageData.pagination.pageSize)
                .then(onGetSurveySuccess)
                .catch(onGetSurveyError);
        } else if (
            pageData.selectCategory.name === 'getActive' ||
            pageData.selectCategory.name === 'getInActive' ||
            pageData.selectCategory.name === 'getDraft'
        ) {
            if (pageData.selectCategory.id) {
                surveysService
                    .getByStatus(page - 1, pageData.pagination.pageSize, pageData.selectCategory.id)
                    .then(onGetSurveySuccess)
                    .catch(onGetSurveyError);
            }
        }
        setPageData((prevState) => {
            const ps = { ...prevState };
            ps.pagination.current = page;
            return ps;
        });
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 250);
    };

    const changePageSize = (e) => {
        const pageSize = e.target.value;
        setPageData((prevState) => {
            const ps = { ...prevState };
            ps.pagination.pageSize = pageSize;
            return ps;
        });
    };

    const handleSubmit = (values) => {
        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.selectCategory = { name: 'search', id: '' };
            pd.formData = { query: values };
            return pd;
        });
        surveysService.search(0, pageData.pagination.pageSize, values).then(onGetSurveySuccess).catch(onGetSurveyError);
    };

    const handleToggleStatus = useCallback((id, payload) => {
        const handler = toggleSuccessHandler(id);
        surveysService.update(id, payload).then(handler).catch(onGetSurveyError);
    }, []);

    const toggleSuccessHandler = (id) => {
        return () => {
            setPageData((prevState) => {
                const pd = { ...prevState };
                pd.surveys = [...pd.surveys];

                const idxOf = pd.surveys.findIndex((survey) => {
                    let result = false;
                    if (survey.id === id) {
                        result = true;
                    }
                    return result;
                });

                if (idxOf >= 0) {
                    pd.surveys[idxOf].surveyStatus.id !== 2
                        ? (pd.surveys[idxOf].surveyStatus.name = 'Active')
                        : (pd.surveys[idxOf].surveyStatus.name = 'InActive');
                    pd.surveys[idxOf].surveyStatus.id !== 2
                        ? (pd.surveys[idxOf].surveyStatus.id = 2)
                        : (pd.surveys[idxOf].surveyStatus.id = 3);
                    pd.surveyComponents = pd.surveys.map(mapSurvey);
                }
                pd.surveysData.update++;
                return pd;
            });
        };
    };

    const onGetSurveySuccess = (data) => {
        _logger('Success', data);
        let arrayOfSurveys = data.item.pagedItems;
        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.surveys = arrayOfSurveys;
            pd.surveyComponents = arrayOfSurveys.map(mapSurvey);
            pd.pagination.total = data.item.totalCount;
            return pd;
        });
    };

    const onGetSurveyError = (err) => {
        _logger('Error', err);
        if (err.response.data.errors[0] === 'Records Not Found') {
            let arrayOfSurveys = [];
            setPageData((prevState) => {
                const pd = { ...prevState };
                pd.surveys = arrayOfSurveys;
                pd.surveyComponents = arrayOfSurveys.map(mapSurvey);
                pd.pagination.current = 1;
                pd.pagination.total = 1;
                return pd;
            });
        }
        toastr.options.preventDuplicates = true;
        toastr.error('Surveys Error');
    };

    return (
        <React.Fragment>
            <SurveysData
                categoryChange={handleCategoryChange}
                surveyData={pageData.surveysData}
                selectCategory={pageData.selectCategory.name}
            />

            <Row className="mt-2">
                <Col xs={6} md={8}>
                    <h4 className="page-title">Surveys</h4>
                </Col>

                <Col xs={6} md={4}>
                    <SurveysSearch handleSubmit={handleSubmit} />
                </Col>
            </Row>
            <Row className="mb-2">
                <Col xs={6} sm={4} md={3} className="pe-0">
                    <ButtonGroup>
                        <Button
                            value="getAll"
                            className={
                                pageData.selectCategory.name === 'getAll'
                                    ? 'btn btn-primary shadow-none'
                                    : 'btn btn-light'
                            }
                            onClick={handleCategoryChange}>
                            All
                        </Button>
                        <Button
                            value="getCreatedBy"
                            className={
                                pageData.selectCategory.name === 'getCreatedBy'
                                    ? 'btn btn-primary shadow-none'
                                    : 'btn btn-light'
                            }
                            onClick={handleCategoryChange}>
                            My Surveys
                        </Button>
                    </ButtonGroup>
                </Col>
                <Col className="align-self-end ps-0">
                    <Row className="justify-content-end">
                        <Col className="col-auto d-none d-sm-block">
                            <form>
                                <label htmlFor="pagesize-select" className="d-inline-block fw-normal me-2">
                                    Page Size:
                                </label>
                                <select
                                    className="form-select d-inline-block w-auto surveys-pagesize"
                                    id="pagesize-select"
                                    onChange={changePageSize}>
                                    <option value="8">8</option>
                                    <option value="16">16</option>
                                    <option value="24">24</option>
                                </select>
                            </form>
                        </Col>
                        <Col className="col-auto align-self-end d-flex ">
                            <Pagination
                                onChange={onPagChange}
                                current={pageData.pagination.current}
                                pageSize={pageData.pagination.pageSize}
                                total={pageData.pagination.total}
                                locale={locale}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="g-2 mb-3">
                {pageData.surveys.length === 0 ? <h3 className="m-4">No Records Found</h3> : pageData.surveyComponents}
            </Row>
            {pageData.pagination.total > pageData.pagination.pageSize && pageData.pagination.pageSize > 8 && (
                <div className="align-self-end d-flex justify-content-end my-2 mb-md-4 mb-lg-2 d-none d-lg-flex">
                    <Pagination
                        onChange={onPagChange}
                        current={pageData.pagination.current}
                        pageSize={pageData.pagination.pageSize}
                        total={pageData.pagination.total}
                        locale={locale}
                    />
                </div>
            )}
            <div className="align-self-end d-flex justify-content-end my-2 mb-md-4 d-lg-none">
                <Pagination
                    onChange={onPagChange}
                    current={pageData.pagination.current}
                    pageSize={pageData.pagination.pageSize}
                    total={pageData.pagination.total}
                    locale={locale}
                />
            </div>
        </React.Fragment>
    );
}

export default Surveys;
