using Tekton.Data;
using Tekton.Data.Providers;
using Tekton.Models;
using Tekton.Models.Domain;
using Tekton.Models.Domain.Surveys;
using Tekton.Models.Requests.Surveys;
using Tekton.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Tekton.Services
{
    public class SurveyService : ISurveyService
    {
        private IDataProvider _data = null;
        private ILookUpService _lookUpService = null;
        private IUserProfilesService _userProfilesService = null;

        public SurveyService(IDataProvider data, ILookUpService lookupService, IUserProfilesService userProfilesService)
        {
            _data = data;
            _lookUpService = lookupService;
            _userProfilesService = userProfilesService;
        }

        public Paged<Survey> Search(int pageIndex, int pageSize, string query)
        {
            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Surveys_Search]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@Query", query);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Survey survey = MapSingleSurvey(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Survey>();
                }
                list.Add(survey);
            });
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public Paged<Survey> CreatedBy(int pageIndex, int pageSize, int createdById)
        {
            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;
            string procName = "[Surveys_Select_ByCreatedBy]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@CreatedBy", createdById);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Survey survey = MapSingleSurvey(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Survey>();
                }
                list.Add(survey);
            });
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public Paged<Survey> Pagination(int pageIndex, int pageSize)
        {
            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Surveys_SelectAll]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Survey survey = MapSingleSurvey(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Survey>();
                }
                list.Add(survey);
            });
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }
        public Paged<Survey> Status(int pageIndex, int pageSize, int statusId)
        {
            Paged<Survey> pagedList = null;
            List<Survey> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Surveys_Select_ByStatus]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@StatusId", statusId);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Survey survey = MapSingleSurvey(reader, ref startingIndex);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }
                if (list == null)
                {
                    list = new List<Survey>();
                }
                list.Add(survey);
            });
            if (list != null)
            {
                pagedList = new Paged<Survey>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Survey Get(int id)
        {
            string procName = "[dbo].[Surveys_Select_ById]";
            Survey survey = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startIndex = 0;
                survey = MapSingleSurvey((SqlDataReader)reader, ref startIndex);
            });
            return survey;
        }
        public SurveyAnalytics GetAnalytics(int id)
        {
            string procName = "[dbo].[Surveys_SelectById_Analytics]";
            SurveyAnalytics survey = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            }, delegate (IDataReader reader, short set)
            {
                int startIndex = 0;
                survey = MapSingleSurveyDetails((SqlDataReader)reader, ref startIndex);
            });
            return survey;
        }
        public List<LookUp> GetSurveyTypes()
        {
            string procName = "[dbo].[SurveyTypes_SelectAll]";
            List<LookUp> list = null;
            _data.ExecuteCmd(procName, inputParamMapper:null , delegate (IDataReader reader, short set)
            {
                int startIndex = 0;
                LookUp surveyType = MapSingleLookUp((SqlDataReader)reader, ref startIndex);
                if (list == null)
                {
                    list = new List<LookUp>();
                }
                list.Add(surveyType);
            });
            return list;
        }
        public List<LookUp> GetSurveyStatus()
        {
            string procName = "[dbo].[Status_SelectAll]";
            List<LookUp> list = null;
            _data.ExecuteCmd(procName, inputParamMapper: null, delegate (IDataReader reader, short set)
            {
                int startIndex = 0;
                LookUp surveyType = MapSingleLookUp((SqlDataReader)reader, ref startIndex);
                if (list == null)
                {
                    list = new List<LookUp>();
                }
                list.Add(surveyType);
            });
            return list;
        }

        public SurveyData GetSurveyData()
        {
            string procName = "[dbo].[Surveys_Select_StatusCount]";
            SurveyData surveyData = null;
            _data.ExecuteCmd(procName, inputParamMapper:null, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                surveyData = MapSingleSurveyData(reader, ref startingIndex);
            });
            return surveyData;
        }

        public int Add(SurveyAddRequest model, int createdById)
        {
            int id = 0;
            string procName = "[dbo].[Surveys_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", createdById);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }

        public void Update(SurveyUpdateRequest model)
        {
            string procName = "[dbo].[Surveys_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        private void AddCommonParams(SurveyAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@StatusId", model.StatusId);
            col.AddWithValue("@SurveyTypeId", model.SurveyTypeId);
            col.AddWithValue("@CompanyLogo", model.CompanyLogo);
        }

        public Survey MapSingleSurvey(IDataReader reader, ref int startingIndex)
        {
            Survey aSurvey = new Survey();
            aSurvey.Id = reader.GetSafeInt32(startingIndex++);
            aSurvey.Name = reader.GetSafeString(startingIndex++);
            aSurvey.Description = reader.GetSafeString(startingIndex++);
            aSurvey.SurveyStatus = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aSurvey.SurveyType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aSurvey.CompanyLogo = reader.GetSafeString(startingIndex++);
            aSurvey.CreatedBy = _userProfilesService.MapSingleUser(reader, ref startingIndex);
            aSurvey.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aSurvey.DateModified = reader.GetSafeDateTime(startingIndex++);
            aSurvey.SurveyQuestions = reader.GetSafeInt32(startingIndex++);
            aSurvey.SurveyResponses = reader.GetSafeInt32(startingIndex++);

            return aSurvey;
        }

        public SurveyAnalytics MapSingleSurveyDetails(IDataReader reader, ref int startingIndex)
        {
            SurveyAnalytics aSurvey = new SurveyAnalytics();
            aSurvey.Id = reader.GetSafeInt32(startingIndex++);
            aSurvey.Name = reader.GetSafeString(startingIndex++);
            aSurvey.Description = reader.GetSafeString(startingIndex++);
            aSurvey.SurveyStatus = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aSurvey.SurveyType = _lookUpService.MapSingleLookUp(reader, ref startingIndex);
            aSurvey.CompanyLogo = reader.GetSafeString(startingIndex++);
            aSurvey.CreatedBy = _userProfilesService.MapSingleUser(reader, ref startingIndex);
            aSurvey.DateCreated = reader.GetSafeDateTime(startingIndex++);
            aSurvey.DateModified = reader.GetSafeDateTime(startingIndex++);
            aSurvey.Questions = reader.DeserializeObject<List<SurveyQuestionDetails>>(startingIndex++);

            return aSurvey;
        }
        private SurveyData MapSingleSurveyData(IDataReader reader, ref int startingIndex)
        {
            SurveyData surveyData = new SurveyData();
            surveyData.ActiveSurveys = reader.GetSafeInt32(startingIndex++);
            surveyData.InActiveSurveys = reader.GetSafeInt32(startingIndex++);
            surveyData.DraftSurveys = reader.GetSafeInt32(startingIndex++);
            return surveyData;
        }

        private LookUp MapSingleLookUp(SqlDataReader reader, ref int startIndex)
        {
            LookUp surveyType = new LookUp();
            surveyType.Id = reader.GetSafeInt32(startIndex++);
            surveyType.Name = reader.GetSafeString(startIndex++);
            return surveyType;
        }

    }
}
