namespace ATM.Domain.ValueObjects
{
    public record CardNumber
    {
        public string Value { get; }

        public CardNumber(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                throw new ArgumentException("Card number is required", nameof(value));

            var cleaned = value.Replace(" ", "").Replace("-", "");

            if (!IsValidLuhn(cleaned))
                throw new ArgumentException("Invalid card number", nameof(value));

            Value = cleaned;
        }

        private static bool IsValidLuhn(string number)
        {
            if (number.Length < 13 || number.Length > 19)
                return false;

            int sum = 0;
            bool alternate = false;

            for (int i = number.Length - 1; i >= 0; i--)
            {
                if (!char.IsDigit(number[i]))
                    return false;

                int n = int.Parse(number[i].ToString());

                if (alternate)
                {
                    n *= 2;
                    if (n > 9)
                        n -= 9;
                }

                sum += n;
                alternate = !alternate;
            }

            return sum % 10 == 0;
        }

        public string Masked => $"****-****-****-{Value[^4..]}";
    }

}
