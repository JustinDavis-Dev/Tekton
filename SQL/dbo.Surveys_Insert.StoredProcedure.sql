USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_Insert]    Script Date: 9/22/2022 9:53:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Justin Davis
-- Create date: 08/24/2022
-- Description: Surveys Insert
-- Code Reviewer: Alec Stahnke

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Surveys_Insert]
			@Name NVARCHAR(100)
			,@Description NVARCHAR(2000)
			,@StatusId INT
			,@SurveyTypeId INT
			,@CompanyLogo NVARCHAR(255)
			,@CreatedBy INT
			,@Id INT OUTPUT

/* --- TEST CODE ---
			DECLARE @Id INT = 0
					,@Name NVARCHAR(100) = 'Test Name'
					,@Description NVARCHAR(2000) = 'Test Description'
					,@StatusId INT = 1
					,@SurveyTypeId INT = 1
					,@CompanyLogo NVARCHAR(255) = 'https://bit.ly/3AwK8MO'
					,@CreatedBy INT = 24
					
			EXECUTE [dbo].[Surveys_Insert]
						@Name
						,@Description
						,@StatusId
						,@SurveyTypeId
						,@CompanyLogo
						,@CreatedBy
						,@Id OUTPUT

			SELECT *
			FROM [dbo].[Surveys]
			WHERE [Id] = @Id
*/

AS
BEGIN		
			INSERT INTO [dbo].[Surveys]
					([Name]
					,[Description]
					,[StatusId]
					,[SurveyTypeId]
					,[CompanyLogo]
					,[CreatedBy])
			VALUES
					(@Name
					,@Description
					,@StatusId
					,@SurveyTypeId
					,@CompanyLogo
					,@CreatedBy)

			SET @Id = SCOPE_IDENTITY()
END
GO
