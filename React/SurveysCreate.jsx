import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, Field } from 'formik';
import { useLocation, useNavigate } from 'react-router-dom';
import FileUploader from '../../components/files/FileUploader';
import surveysSchema from '../../schemas/surveysSchema';
import surveysService from '../../services/surveysService';
import './surveys.css';
import Swal from 'sweetalert2';
import debug from 'sabio-debug';

const _logger = debug.extend('SurveysCreate');

function SurveysCreate() {
    const [pageData, setPageData] = useState({
        formData: {
            id: '',
            name: '',
            description: '',
            statusId: 1,
            surveyTypeId: '',
            companyLogo:
                'https://sabio-training.s3-us-west-2.amazonaws.com/915acb65-a80c-4dbe-89c7-e88a8bee9745_logo.webp',
        },
        statuses: { statuesArray: [], statuesOptions: [] },
        surveyTypes: { surveyTypeArray: [], surveyTypeOptions: [] },
    });
    const { state } = useLocation();
    const navigate = useNavigate();
    const formRef = useRef();

    useEffect(() => {
        if (state?.type === 'SURVEY_INFO' && state?.payload) {
            setPageData((prevState) => {
                const pd = { ...prevState };
                pd.formData.id = state.payload.id;
                pd.formData.name = state.payload.name;
                pd.formData.description = state.payload.description;
                pd.formData.statusId = state.payload.surveyStatus.id;
                pd.formData.surveyTypeId = state.payload.surveyType.id;
                pd.formData.companyLogo = state.payload.companyLogo;
                return pd;
            });
        }
    }, [state]);

    useEffect(() => {
        surveysService.getStatuses().then(onGetStatusesSuccess).catch(onServiceError);
        surveysService.getSurveyTypes().then(onGetSurveyTypesSuccess).catch(onServiceError);
    }, []);

    const onGetStatusesSuccess = (data) => {
        let arrayOfStatuses = data.items;
        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.statuses.statuesArray = arrayOfStatuses;
            pd.statuses.statuesOptions = arrayOfStatuses.map(mapLookup);
            return pd;
        });
    };

    const onGetSurveyTypesSuccess = (data) => {
        let arrayOfTypes = data.items;
        setPageData((prevState) => {
            const pd = { ...prevState };
            pd.surveyTypes.surveyTypeArray = arrayOfTypes;
            pd.surveyTypes.surveyTypeOptions = arrayOfTypes.map(mapLookup);
            return pd;
        });
    };

    const mapLookup = (lookup) => (
        <option value={lookup.id} key={`lookup_${lookup.name}_${lookup.id}`}>
            {lookup.name}
        </option>
    );

    const handleSubmit = (values) => {
        const id = values.id;
        if (id) {
            surveysService.update(id, values).then(submitSuccessHandler).catch(onServiceError);
        } else {
            surveysService.add(values).then(submitSuccessHandler).catch(onServiceError);
        }
    };

    const submitSuccessHandler = (data) => {
        const id = data.item || formRef.current.values.id;
        const payload = {
            id: id,
            name: formRef.current.values.name,
            description: formRef.current.values.description,
            statusId: formRef.current.values.statusId,
            surveyTypeId: formRef.current.values.surveyTypeId,
            companyLogo: formRef.current.values.companyLogo,
        };
        const stateForTransport = { type: 'SURVEY_INFO', payload: payload };
        navigate('/surveybuilder', { state: stateForTransport });
    };

    const onServiceError = (err) => {
        _logger(err);
    };

    const handleBack = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'Your work has not been saved!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/surveys');
            }
        });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="page-title-box">
                        <h4 className="page-title">Create Survey</h4>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-center mb-2">
                <div className="col-8">
                    <Formik
                        innerRef={formRef}
                        enableReinitialize={true}
                        initialValues={pageData.formData}
                        onSubmit={handleSubmit}
                        validationSchema={surveysSchema.surveysFormSchema}>
                        {({ values, touched, errors, setFieldValue }) => (
                            <Form className="bg-light border rounded p-3">
                                <div className="form-group mt-0 mb-2">
                                    <label htmlFor="name">Name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder={'Survey Name'}
                                        className={
                                            touched.name && errors.name ? 'form-control is-invalid ' : 'form-control'
                                        }
                                    />
                                    {touched.name && errors.name ? (
                                        <div className="invalid-feedback position-absolute m-0 ms-1 w-auto">
                                            {errors.name}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="form-group mt-0 mb-2">
                                    <label htmlFor="description">Description</label>
                                    <Field
                                        component={'textarea'}
                                        name="description"
                                        placeholder={'Survey Description'}
                                        className={
                                            touched.description && errors.description
                                                ? 'form-control is-invalid '
                                                : 'form-control'
                                        }
                                    />
                                    {touched.description && errors.description ? (
                                        <div className="invalid-feedback position-absolute m-0 ms-1 w-auto">
                                            {errors.description}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="form-group mt-0 mb-2">
                                    <label htmlFor="surveyTypeId">Survey Type</label>
                                    <Field
                                        component={'select'}
                                        name="surveyTypeId"
                                        className={
                                            touched.surveyTypeId && errors.surveyTypeId
                                                ? 'form-select is-invalid'
                                                : 'form-select'
                                        }>
                                        <option value="">Select Survey Type</option>
                                        {pageData.surveyTypes.surveyTypeOptions}
                                    </Field>
                                    {touched.surveyTypeId && errors.surveyTypeId ? (
                                        <div className="invalid-feedback position-absolute m-0 ms-1 w-auto">
                                            {errors.surveyTypeId}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="form-group mt-0 mb-2">
                                    <label htmlFor="statusId">Status</label>
                                    <Field
                                        component={'select'}
                                        name="statusId"
                                        className={
                                            touched.statusId && errors.statusId
                                                ? 'form-select is-invalid'
                                                : 'form-select'
                                        }>
                                        <option value="">Select Survey Status</option>
                                        {pageData.statuses.statuesOptions}
                                    </Field>
                                    {touched.statusId && errors.statusId ? (
                                        <div className="invalid-feedback position-absolute m-0 ms-1 w-auto">
                                            {errors.statusId}
                                        </div>
                                    ) : null}
                                </div>

                                <div className="form-group mt-0 mb-2">
                                    <label htmlFor="companyLogo">Company Logo</label>
                                    <div className="row m-1">
                                        <div className="col-6 text-center survey-dropzone">
                                            <FileUploader
                                                getAwsResponse={(res) => {
                                                    setFieldValue('companyLogo', res.data.items[0].url);
                                                }}
                                                isMultipleFiles={false}
                                                name="companyLogo"
                                                className="form-control"></FileUploader>
                                        </div>

                                        <div className="col-6 text-center">
                                            {values.companyLogo && (
                                                <img
                                                    src={values.companyLogo}
                                                    className="img-thumbnail surveys-form-image"
                                                    alt="company logo"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="button-group mt-4">
                                    <button type="button" className="btn btn-secondary" onClick={handleBack}>
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary ms-1">
                                        Next
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default SurveysCreate;
