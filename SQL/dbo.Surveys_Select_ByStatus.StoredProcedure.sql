USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_Select_ByStatus]    Script Date: 9/22/2022 9:53:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[Surveys_Select_ByStatus]
			@PageIndex INT
			,@PageSize INT
			,@StatusId INT

/* --- TEST CODE ---
			DECLARE @PageIndex INT = 0
					,@PageSize INT = 10
					,@StatusId INT = 1

			EXECUTE [dbo].[Surveys_Select_ByStatus]
						@PageIndex
						,@PageSize
						,@StatusId
*/

AS
BEGIN
			DECLARE @Offset INT = @PageIndex * @PageSize

			SELECT	s.[Id]
					,s.[Name] AS SurveyName
					,s.[Description]
					,ss.[Id] AS SurveyStatusId
					,ss.[Name] AS SurveyStatusName
					,st.[Id] AS SurveyTypeId
					,st.[Name] AS SurveyTypeName
					,s.[CompanyLogo]
					,up.[Id]
					,up.[UserId]
					,up.[FirstName]
					,up.[LastName]
					,up.[MI]
					,up.[AvatarUrl]
					,up.[DateCreated]
					,up.[DateModified]
					,s.[DateCreated] AS SurveyDateCreated
					,s.[DateModified] AS SurveyDateModified
					,(	SELECT COUNT(*) 
						FROM [dbo].[SurveyQuestions] AS sq
						WHERE sq.SurveyId = s.Id	) AS SurveyQuestions
					,(	SELECT COUNT(*) 
						FROM [dbo].[SurveysInstances] AS si
						WHERE si.SurveyId = s.Id	) AS SurveyResponses
					,TotalCount = COUNT(1) OVER()
			FROM [dbo].[Surveys] AS s
					INNER JOIN [dbo].[SurveyTypes] AS st
							ON s.SurveyTypeId = st.Id
					INNER JOIN [dbo].[Status] AS ss
							ON s.StatusId = ss.Id
					INNER JOIN [dbo].[UserProfiles] AS up
							ON s.CreatedBy = up.UserId
			WHERE s.[StatusId] = @StatusId
			ORDER BY s.[Id]

			OFFSET @Offset ROWS
			FETCH NEXT @PageSize ROWS ONLY
END
GO
