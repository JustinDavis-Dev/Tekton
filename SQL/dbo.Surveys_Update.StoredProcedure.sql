USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_Update]    Script Date: 9/22/2022 9:53:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Justin Davis
-- Create date: 08/24/2022
-- Description: Surveys Update
-- Code Reviewer: Alec Stahnke

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================

CREATE PROC [dbo].[Surveys_Update]
			@Name NVARCHAR(100)
			,@Description NVARCHAR(2000)
			,@StatusId INT
			,@SurveyTypeId INT
			,@CompanyLogo NVARCHAR(255)
			,@Id INT

/* --- TEST CODE ---
			DECLARE @Id INT = 11
					,@Name NVARCHAR(100) = 'Test Name Update'
					,@Description NVARCHAR(2000) = 'Test Description Update'
					,@StatusId INT = 3
					,@SurveyTypeId INT = 3
					,@CompanyLogo NVARCHAR(255) = 'https://bit.ly/3AwK8MO'

			SELECT *
			FROM [dbo].[Surveys]
			WHERE [Id] = @Id
					
			EXECUTE [dbo].[Surveys_Update]
						@Name
						,@Description
						,@StatusId
						,@SurveyTypeId
						,@CompanyLogo
						,@Id

			SELECT *
			FROM [dbo].[Surveys]
			WHERE [Id] = @Id
*/

AS
BEGIN		
			DECLARE @DateModified DATETIME2 = GETUTCDATE()

			UPDATE [dbo].[Surveys]
			   SET [Name] = @Name
				  ,[Description] = @Description
				  ,[StatusId] = @StatusId
				  ,[SurveyTypeId] = @SurveyTypeId
				  ,[CompanyLogo] = @CompanyLogo
				  ,[DateModified] = @DateModified
					
			WHERE [Id] = @Id
END
GO
