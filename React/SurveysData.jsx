import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RiSurveyLine, RiDraftLine } from 'react-icons/ri';
import { MdVisibilityOff } from 'react-icons/md';
import surveysService from '../../services/surveysService';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import debug from 'sabio-debug';

const _logger = debug.extend('SurveysData');

function SurveysData(props) {
    const [surveysData, setSurveysData] = useState({
        active: 0,
        inactive: 0,
        draft: 0,
    });

    useEffect(() => {
        surveysService.getSurveysData().then(onGetSurveysDataSuccess).catch(onGetSurveysDataError);
    }, [props.surveyData.update]);

    const handleCategoryChange = (e) => {
        const name = e.currentTarget.dataset.name;
        const id = e.currentTarget.dataset.id;
        props.categoryChange(name, id);
    };

    const onGetSurveysDataSuccess = (data) => {
        _logger(data);
        setSurveysData((prevState) => {
            const ps = { ...prevState };
            ps.active = data.item.activeSurveys;
            ps.inactive = data.item.inActiveSurveys;
            ps.draft = data.item.draftSurveys;
            return ps;
        });
    };

    const onGetSurveysDataError = (err) => {
        _logger(err);
        toastr.error(err);
    };

    return (
        <Row className="surveys-data-image rounded mt-2">
            <Container fluid>
                <Card className="mb-0 bg-transparent">
                    <Row className="m-4">
                        <Col className="surveys-data-col">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="tooltip-bottom">Active Surveys</Tooltip>}>
                                <Card
                                    className={
                                        props.selectCategory === 'getActive'
                                            ? 'surveys-data-card surveys-selected'
                                            : 'surveys-data-card'
                                    }
                                    role="button"
                                    data-name="getActive"
                                    data-id="2"
                                    onClick={handleCategoryChange}>
                                    <Row className="g-0 align-items-center">
                                        <Col
                                            md={4}
                                            className="text-center bg-success h-100 rounded-start d-none d-md-block">
                                            <RiSurveyLine className="text-light fs-1 h-100" />
                                        </Col>
                                        <Col md={8} className="text-center">
                                            <Card.Body className="p-0">
                                                <h2 className="text-success m-1">{surveysData.active}</h2>
                                                <Card.Title className="m-1">Active</Card.Title>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col className="surveys-data-col">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="tooltip-bottom">InActive Surveys</Tooltip>}>
                                <Card
                                    className={
                                        props.selectCategory === 'getInActive'
                                            ? 'surveys-data-card surveys-selected'
                                            : 'surveys-data-card'
                                    }
                                    role="button"
                                    data-name="getInActive"
                                    data-id="3"
                                    onClick={handleCategoryChange}>
                                    <Row className="g-0 align-items-center">
                                        <Col
                                            md={4}
                                            className="text-center bg-warning h-100 rounded-start d-none d-md-block">
                                            <MdVisibilityOff className="text-light fs-1 h-100" />
                                        </Col>

                                        <Col md={8} className="text-center">
                                            <Card.Body className="p-0">
                                                <h2 className="text-warning m-1">{surveysData.inactive}</h2>
                                                <Card.Title className="m-1">InActive</Card.Title>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col className="surveys-data-col">
                            <OverlayTrigger
                                placement="bottom"
                                overlay={<Tooltip id="tooltip-bottom">Draft Surveys</Tooltip>}>
                                <Card
                                    className={
                                        props.selectCategory === 'getDraft'
                                            ? 'surveys-data-card surveys-selected'
                                            : 'surveys-data-card'
                                    }
                                    role="button"
                                    data-name="getDraft"
                                    data-id="1"
                                    onClick={handleCategoryChange}>
                                    <Row className="g-0 align-items-center">
                                        <Col
                                            md={4}
                                            className="text-center bg-dark h-100 rounded-start d-none d-md-block">
                                            <RiDraftLine className="text-light fs-1 h-100" />
                                        </Col>

                                        <Col md={8} className="text-center">
                                            <Card.Body className="p-0">
                                                <h2 className="text-dark m-1">{surveysData.draft}</h2>
                                                <Card.Title className="m-1">Draft</Card.Title>
                                            </Card.Body>
                                        </Col>
                                    </Row>
                                </Card>
                            </OverlayTrigger>
                        </Col>
                        <Col className="m-0 p-1 align-self-center text-center">
                            <Link to="/surveys/create" type="button" className="btn btn-success">
                                Create Survey
                            </Link>
                        </Col>
                    </Row>
                </Card>
            </Container>
        </Row>
    );
}

SurveysData.propTypes = {
    categoryChange: PropTypes.func.isRequired,
    surveyData: PropTypes.shape({
        update: PropTypes.number.isRequired,
    }),
    selectCategory: PropTypes.string.isRequired,
};

export default SurveysData;
