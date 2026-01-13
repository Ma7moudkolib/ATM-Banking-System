namespace ATM.Application.DTOs.Authentication
{
    public class CardAuthResponse
    {
        public Guid SessionId { get; set; }
        public string CardNumber { get; set; }
        public string AccountNumber { get; set; }
        public string CustomerName { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
