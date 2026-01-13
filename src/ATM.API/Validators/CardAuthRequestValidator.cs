using ATM.Application.DTOs.Authentication;
using FluentValidation;

namespace ATM.API.Validators
{
    public class CardAuthRequestValidator : AbstractValidator<CardAuthRequest>
    {
        public CardAuthRequestValidator()
        {
            RuleFor(x => x.CardNumber)
                .NotEmpty().WithMessage("Card number is required")
                .MinimumLength(13).WithMessage("Card number must be at least 13 digits")
                .MaximumLength(19).WithMessage("Card number must not exceed 19 digits");

            RuleFor(x => x.Pin)
                .NotEmpty().WithMessage("PIN is required")
                .Length(4).WithMessage("PIN must be exactly 4 digits")
                .Matches(@"^\d{4}$").WithMessage("PIN must contain only digits");
        }
    }
}
