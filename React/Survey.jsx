import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Dropdown, Badge } from 'react-bootstrap';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

function Survey(props) {
    const aSurvey = props.survey;
    const navigate = useNavigate();
    const newDate = new Date(aSurvey.dateCreated).toDateString();
    const handleToggleStatusClicked = () => {
        const id = aSurvey.id;
        const newStatus = aSurvey.surveyStatus.id === 2 ? 3 : 2;
        const payload = {
            name: aSurvey.name,
            description: aSurvey.description,
            statusId: newStatus,
            surveyTypeId: aSurvey.surveyType.id,
            companyLogo: aSurvey.companyLogo,
        };
        props.toggleStatus(id, payload);
    };

    const handleEditClicked = () => {
        const stateForTransport = { type: 'SURVEY_INFO', payload: aSurvey };
        navigate(`edit/${aSurvey.id}`, { state: stateForTransport });
    };

    const handleAnalyticsClicked = () => {
        navigate(`analytics/${aSurvey.id}`);
    };

    return (
        <Col xs={12} sm={6} lg={4} xl={3}>
            <Card className="mb-0">
                <Card.Body>
                    <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                            <img
                                className="surveys-card-image"
                                alt={aSurvey.name + ' Logo'}
                                src={aSurvey.companyLogo}
                            />
                        </div>
                        <div className="font-16 fw-bold text-secondary ms-1">{aSurvey.name}</div>
                        <div className="ms-auto">
                            <Dropdown>
                                <Dropdown.Toggle variant="link" className="arrow-none card-drop shadow-none p-0">
                                    <i className={'mdi mdi-dots-vertical'} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu align="end">
                                    <Dropdown.Item onClick={handleEditClicked}>
                                        <i className="uil uil-pen me-1"></i>
                                        Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleToggleStatusClicked}>
                                        <i
                                            className={classNames(
                                                'uil',
                                                {
                                                    'uil-toggle-off': aSurvey.surveyStatus.name === 'Active',
                                                    'uil-toggle-on': aSurvey.surveyStatus.name !== 'Active',
                                                },
                                                'me-1'
                                            )}></i>
                                        {aSurvey.surveyStatus.name === 'Active' ? 'Set Inactive' : 'Set Active'}
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={handleAnalyticsClicked}>
                                        <i className="uil uil-analytics me-1"></i>
                                        Analytics
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                    <Row>
                        <p className="text-muted mb-0">{aSurvey.surveyType.name}</p>
                    </Row>

                    <Row className="my-1">
                        <Col>
                            <Badge
                                pill
                                className={classNames(
                                    {
                                        'bg-success': aSurvey.surveyStatus.name === 'Active',
                                        'bg-secondary': aSurvey.surveyStatus.name === 'Draft',
                                        'bg-warning': aSurvey.surveyStatus.name === 'InActive',
                                    },
                                    'd-inline',
                                    'surveys-badge'
                                )}>
                                {aSurvey.surveyStatus.name}
                            </Badge>
                        </Col>
                    </Row>

                    <Row className="surveys-card-row">
                        {aSurvey.description && <Card.Text>{aSurvey.description}</Card.Text>}
                    </Row>
                    <Row className="my-1">
                        {aSurvey.createdBy && (
                            <Card.Text className="d-inline ">
                                <small className="text-muted">{`Created By: ${aSurvey.createdBy.firstName} ${aSurvey.createdBy.lastName}, ${newDate}`}</small>
                            </Card.Text>
                        )}
                    </Row>

                    <Row>
                        <span className="pe-2 text-nowrap d-inline-block w-auto">
                            <i className="mdi mdi-format-list-bulleted-type text-muted me-1"></i>
                            <b>{aSurvey.surveyQuestions}</b> Questions
                        </span>
                        <span className="text-nowrap d-inline-block w-auto">
                            <i className="mdi mdi-comment-multiple-outline text-muted me-1"></i>
                            <b>{aSurvey.surveyResponses}</b> Responses
                        </span>
                    </Row>
                </Card.Body>
            </Card>
        </Col>
    );
}

Survey.propTypes = {
    survey: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        surveyStatus: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
        surveyType: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }),
        companyLogo: PropTypes.string.isRequired,
        createdBy: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string.isRequired,
        }),
        surveyQuestions: PropTypes.number.isRequired,
        surveyResponses: PropTypes.number.isRequired,
        dateCreated: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }),
    toggleStatus: PropTypes.func.isRequired,
};

export default Survey;
