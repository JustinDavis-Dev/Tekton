using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Models.Requests.Surveys
{
    public class SurveyAddRequest
    {
        [Required]
        [MaxLength(100), MinLength(2)]
        public string Name { get; set; }

        [Required]
        [MaxLength(2000), MinLength(2)]
        public string Description { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int StatusId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int SurveyTypeId { get; set; }

        [Required]
        [MaxLength(255), MinLength(2)]
        public string CompanyLogo { get; set; }

    }
}
