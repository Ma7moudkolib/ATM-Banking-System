using Microsoft.AspNetCore.Mvc;
using ATM.Application.DTOs.Authentication;
using ATM.Application.DTOs.Common;
using ATM.Application.Interfaces.Services;


namespace ATM.API.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(IServiceManager serviceManager, ILogger<AuthenticationController> logger)
        {
            _serviceManager = serviceManager;
            _logger = logger;
        }

        /// <summary>
        /// Authenticate card with PIN
        /// </summary>
        [HttpPost("login")]
        [ProducesResponseType(typeof(ApiResponse<CardAuthResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] CardAuthRequest request)
        {
            _logger.LogInformation("Authentication attempt for card: {CardNumber}", request.CardNumber);

            var result = await _serviceManager.Authentication.AuthenticateCardAsync(request);

            return Ok(ApiResponse<CardAuthResponse>.SuccessResponse(
                result,
                "Authentication successful"
            ));
        }

        /// <summary>
        /// Validate session
        /// </summary>
        [HttpGet("validate/{sessionId}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        public async Task<IActionResult> ValidateSession(Guid sessionId)
        {
            var isValid = await _serviceManager.Authentication.ValidateSessionAsync(sessionId);

            return Ok(ApiResponse<bool>.SuccessResponse(
                isValid,
                isValid ? "Session is valid" : "Session is invalid or expired"
            ));
        }
    }
}
