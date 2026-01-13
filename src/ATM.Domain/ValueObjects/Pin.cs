namespace ATM.Domain.ValueObjects
{
    public record Pin
    {
        public string HashedValue { get; }

        private Pin(string hashedValue)
        {
            HashedValue = hashedValue;
        }

        public static Pin Create(string plainPin)
        {
            if (string.IsNullOrWhiteSpace(plainPin))
                throw new ArgumentException("PIN is required", nameof(plainPin));

            if (plainPin.Length != 4 || !plainPin.All(char.IsDigit))
                throw new ArgumentException("PIN must be 4 digits", nameof(plainPin));

            var hashed = BCrypt.Net.BCrypt.HashPassword(plainPin);
            return new Pin(hashed);
        }

        public static Pin FromHash(string hashedValue)
        {
            if (string.IsNullOrWhiteSpace(hashedValue))
                throw new ArgumentException("Hashed PIN is required", nameof(hashedValue));

            return new Pin(hashedValue);
        }

        public bool Verify(string plainPin)
        {
            if (string.IsNullOrWhiteSpace(plainPin))
                return false;

            return BCrypt.Net.BCrypt.Verify(plainPin, HashedValue);
        }
    }

}
