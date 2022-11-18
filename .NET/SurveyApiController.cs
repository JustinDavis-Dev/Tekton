using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tekton.Models;
using Tekton.Models.Domain;
using Tekton.Models.Domain.Surveys;
using Tekton.Models.Requests.Surveys;
using Tekton.Services;
using Tekton.Web.Controllers;
using Tekton.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Tekton.Web.Api.Controllers
{
    [Route("api/surveys")]
    [ApiController]
    public class SurveyApiController : BaseApiController
    {
        private ISurveyService _service = null;
        private IAuthenticationService<int> _authService = null;
        public SurveyApiController(ISurveyService service, ILogger<UserApiController> logger, IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Survey>>> SearchPaginated(int pageIndex, int pageSize, string query)
        {
            ActionResult result = null;
            try
            {
                Paged<Survey> paged = _service.Search(pageIndex, pageSize, query);
                if(paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Survey>> response = new ItemResponse<Paged<Survey>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("createdby")]
        public ActionResult<ItemResponse<Paged<Survey>>> getCreatedByPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                Paged<Survey> paged = _service.CreatedBy(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Survey>> response = new ItemResponse<Paged<Survey>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Survey>>> GetPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Survey> paged = _service.Pagination(pageIndex, pageSize);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Survey>> response = new ItemResponse<Paged<Survey>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("status")]
        public ActionResult<ItemResponse<Paged<Survey>>> getByStatusPaginated(int pageIndex, int pageSize, int statusId)
        {
            ActionResult result = null;
            try
            {
                Paged<Survey> paged = _service.Status(pageIndex, pageSize, statusId);
                if (paged == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Survey>> response = new ItemResponse<Paged<Survey>>();
                    response.Item = paged;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Survey>> GetById(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                Survey survey = _service.Get(id);
                if(survey == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<Survey> { Item = survey };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("analytics/{id:int}")]
        public ActionResult<ItemResponse<SurveyAnalytics>> GetSurveyAnalytics(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                SurveyAnalytics survey = _service.GetAnalytics(id);
                if (survey == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<SurveyAnalytics> { Item = survey };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("type")]
        public ActionResult<ItemResponse<LookUp>> GetSurveyType()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<LookUp> list = _service.GetSurveyTypes();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemsResponse<LookUp> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("allstatus")]
        public ActionResult<ItemResponse<LookUp>> GetStatus()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<LookUp> list = _service.GetSurveyStatus();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemsResponse<LookUp> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpGet("surveydata")]
        public ActionResult<ItemResponse<Survey>> GetSurveyData()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                SurveyData surveyData = _service.GetSurveyData();
                if (surveyData == null)
                {
                    code = 404;
                    response = new ErrorResponse("Application resource not found");
                }
                else
                {
                    response = new ItemResponse<SurveyData> { Item = surveyData };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(SurveyAddRequest model)
        {
            ObjectResult result = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<ItemResponse<int>> Update(SurveyUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }
    }
}
