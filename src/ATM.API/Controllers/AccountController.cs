using ATM.Application.DTOs.Account;
using ATM.Application.DTOs.Common;
using ATM.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ATM.API.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        private readonly ILogger<AccountController> _logger;

        public AccountController(IServiceManager serviceManager, ILogger<AccountController> logger)
        {
            _serviceManager = serviceManager;
            _logger = logger;
        }

        /// <summary>
        /// Get account balance
        /// </summary>
        [HttpGet("balance/{sessionId}")]
        [ProducesResponseType(typeof(ApiResponse<BalanceInquiryResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetBalance(Guid sessionId)
        {
            _logger.LogInformation("Balance inquiry for session: {SessionId}", sessionId);

            var result = await _serviceManager.Account.GetBalanceAsync(sessionId);

            return Ok(ApiResponse<BalanceInquiryResponse>.SuccessResponse(
                result,
                "Balance retrieved successfully"
            ));
        }

        /// <summary>
        /// Get account details
        /// </summary>
        [HttpGet("details/{sessionId}")]
        [ProducesResponseType(typeof(ApiResponse<AccountDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetAccountDetails(Guid sessionId)
        {
            _logger.LogInformation("Account details request for session: {SessionId}", sessionId);

            var result = await _serviceManager.Account.GetAccountDetailsAsync(sessionId);

            return Ok(ApiResponse<AccountDto>.SuccessResponse(
                result,
                "Account details retrieved successfully"
            ));
        }
    }

}
