USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_SelectById_Analytics]    Script Date: 9/22/2022 9:53:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Justin Davis
-- Create date: 08/25/2022
-- Description: Surveys Select BY ID Details
-- Code Reviewer: Alec Stahnke

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Surveys_SelectById_Analytics]
			@Id INT

/* --- TEST CODE ---
			DECLARE @Id INT = 1
			EXECUTE [dbo].[Surveys_SelectById_Analytics]
						@Id
			SELECT *
			FROM dbo.surveys
			WHERE Id = @Id

			SELECT *
			FROM dbo.SurveyQuestions
			WHERE SurveyId = @Id
*/

AS
BEGIN
			SELECT	s.[Id]
					,s.[Name]
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
					,Questions = (	SELECT	sq.Id,
											sq.Question,
											sq.SortOrder,
											qt.Id AS QuestionTypeId,
											qt.[Name] AS QuestionTypeName, 
											SurveyAnswers = (	SELECT	sa.AnswerOptionId,
																sqao.Text AS AnswerOptionText,
																sa.Answer,
																COUNT(1) as total
														FROM dbo.SurveyAnswers AS sa
															INNER JOIN dbo.SurveyQuestionAnswerOptions AS sqao
																ON sa.AnswerOptionId = sqao.Id
														WHERE sa.QuestionId = sq.Id	
														GROUP BY
															sa.AnswerOptionId,
															sqao.Text,
															sa.Answer
														FOR JSON PATH	)
									FROM dbo.SurveyQuestions as sq
										INNER JOIN dbo.QuestionTypes as qt
											ON qt.Id = sq.QuestionTypeId
									WHERE sq.SurveyId = s.Id
									FOR JSON PATH	)
			FROM [dbo].[Surveys] AS s
					INNER JOIN [dbo].[SurveyTypes] AS st
							ON s.SurveyTypeId = st.Id
					INNER JOIN [dbo].[Status] AS ss
							ON s.StatusId = ss.Id
					INNER JOIN [dbo].[UserProfiles] AS up
							ON s.CreatedBy = up.UserId
			WHERE s.[Id] = @Id
END
GO
