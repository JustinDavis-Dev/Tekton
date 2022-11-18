using Tekton.Models;
using Tekton.Models.Domain;
using Tekton.Models.Domain.Surveys;
using Tekton.Models.Requests.Surveys;
using System.Collections.Generic;
using System.Data;

namespace Tekton.Services
{
    public interface ISurveyService
    {
        Paged<Survey> Search(int pageIndex, int pageSize, string query);
        Paged<Survey> CreatedBy(int pageIndex, int pageSize, int createdById);
        Paged<Survey> Pagination(int pageIndex, int pageSize);
        Paged<Survey> Status(int pageIndex, int pageSize, int statusId);
        Survey Get(int id);
        SurveyAnalytics GetAnalytics(int id);
        List<LookUp> GetSurveyTypes();
        List<LookUp> GetSurveyStatus();
        SurveyData GetSurveyData();
        int Add(SurveyAddRequest model, int createdById);
        void Update(SurveyUpdateRequest model);
    }
}