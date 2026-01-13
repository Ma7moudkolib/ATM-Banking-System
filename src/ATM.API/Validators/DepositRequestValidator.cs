using ATM.Application.DTOs.Transaction;
using FluentValidation;

namespace ATM.API.Validators
{
    public class DepositRequestValidator : AbstractValidator<DepositRequest>
    {
        public DepositRequestValidator()
        {
            RuleFor(x => x.SessionId)
                .NotEmpty().WithMessage("Session ID is required");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero")
                .LessThanOrEqualTo(10000).WithMessage("Amount cannot exceed $10,000 per transaction");

            RuleFor(x => x.AtmMachineCode)
                .NotEmpty().WithMessage("ATM machine code is required");
        }
    }
}
