USE [Flow]
GO
/****** Object:  StoredProcedure [dbo].[Surveys_Select_StatusCount]    Script Date: 9/22/2022 9:53:14 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROC [dbo].[Surveys_Select_StatusCount]

/* --- TEST CODE ---
			EXECUTE [dbo].[Surveys_Select_StatusCount]
*/

AS
BEGIN
			SELECT	(	SELECT COUNT(*) 
						FROM [dbo].[Surveys]
						WHERE StatusId = 2  ) AS ActiveSurveys
					,(	SELECT COUNT(*) 
						FROM [dbo].[Surveys]
						WHERE StatusId = 3  ) AS InActiveSurveys
					,(	SELECT COUNT(*) 
						FROM [dbo].[Surveys]
						WHERE StatusId = 1	) AS DraftSurveys
END
GO
