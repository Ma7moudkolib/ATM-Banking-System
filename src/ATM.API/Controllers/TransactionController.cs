using ATM.Application.DTOs.Common;
using ATM.Application.DTOs.Transaction;
using ATM.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace ATM.API.Controllers
{
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private readonly IServiceManager _serviceManager;
        private readonly ILogger<TransactionController> _logger;

        public TransactionController(IServiceManager serviceManager, ILogger<TransactionController> logger)
        {
            _serviceManager = serviceManager;
            _logger = logger;
        }

        /// <summary>
        /// Withdraw cash from account
        /// </summary>
        [HttpPost("withdraw")]
        [ProducesResponseType(typeof(ApiResponse<TransactionResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Withdraw([FromBody] WithdrawalRequest request)
        {
            _logger.LogInformation("Withdrawal request: Amount={Amount}, Session={SessionId}",
                request.Amount, request.SessionId);

            var result = await _serviceManager.Transaction.WithdrawAsync(request);

            return Ok(ApiResponse<TransactionResponse>.SuccessResponse(
                result,
                "Withdrawal completed successfully"
            ));
        }

        /// <summary>
        /// Deposit cash to account
        /// </summary>
        [HttpPost("deposit")]
        [ProducesResponseType(typeof(ApiResponse<TransactionResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Deposit([FromBody] DepositRequest request)
        {
            _logger.LogInformation("Deposit request: Amount={Amount}, Session={SessionId}",
                request.Amount, request.SessionId);

            var result = await _serviceManager.Transaction.DepositAsync(request);

            return Ok(ApiResponse<TransactionResponse>.SuccessResponse(
                result,
                "Deposit completed successfully"
            ));
        }

        /// <summary>
        /// Get transaction history
        /// </summary>
        [HttpPost("history")]
        [ProducesResponseType(typeof(ApiResponse<TransactionHistoryResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetHistory([FromBody] TransactionHistoryRequest request)
        {
            _logger.LogInformation("Transaction history request for session: {SessionId}", request.SessionId);

            var result = await _serviceManager.Transaction.GetTransactionHistoryAsync(request);

            return Ok(ApiResponse<TransactionHistoryResponse>.SuccessResponse(
                result,
                "Transaction history retrieved successfully"
            ));
        }
    }
}
