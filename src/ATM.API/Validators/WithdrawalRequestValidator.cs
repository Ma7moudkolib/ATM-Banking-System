using ATM.Application.DTOs.Transaction;
using FluentValidation;

namespace ATM.API.Validators
{
    public class WithdrawalRequestValidator : AbstractValidator<WithdrawalRequest>
    {
        public WithdrawalRequestValidator()
        {
            RuleFor(x => x.SessionId)
                .NotEmpty().WithMessage("Session ID is required");

            RuleFor(x => x.Amount)
                .GreaterThan(0).WithMessage("Amount must be greater than zero")
                .LessThanOrEqualTo(1000).WithMessage("Amount cannot exceed $1000 per transaction")
                .Must(BeMultipleOfTwenty).WithMessage("Amount must be in multiples of $20");

            RuleFor(x => x.AtmMachineCode)
                .NotEmpty().WithMessage("ATM machine code is required");
        }

        private bool BeMultipleOfTwenty(decimal amount)
        {
            return amount % 20 == 0;
        }
    }
}
