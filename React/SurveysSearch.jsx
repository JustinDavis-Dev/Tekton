import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Field, Form, useFormikContext } from 'formik';
import surveysSchema from '../../schemas/surveysSchema';

const SurveysAutoSubmit = () => {
    const { values, submitForm } = useFormikContext();
    useEffect(() => {
        submitForm();
    }, [values.query]);
    return <></>;
};

function SurveysSearch(props) {
    const handleSubmit = (values) => {
        if (values.query) props.handleSubmit(values.query);
    };

    return (
        <Formik
            initialValues={{ query: '' }}
            validationSchema={surveysSchema.surveysSearchSchema}
            onSubmit={handleSubmit}>
            {({ touched, errors }) => (
                <Form>
                    <SurveysAutoSubmit />
                    <Field
                        type="text"
                        className={touched.query && errors.query ? 'form-control is-invalid' : 'form-control'}
                        name="query"
                        placeholder="Search"
                    />
                    {touched.query && errors.query ? (
                        <div className="invalid-feedback position-absolute m-0 ps-1 w-auto ">{errors.query}</div>
                    ) : null}
                </Form>
            )}
        </Formik>
    );
}

SurveysSearch.propTypes = {
    handleSubmit: PropTypes.func.isRequired,
};

export default SurveysSearch;
