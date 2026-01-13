namespace ATM.Application.DTOs.Account
{
    public class BalanceInquiryResponse
    {
        public string AccountNumber { get; set; }
        public decimal AvailableBalance { get; set; }
        public string Currency { get; set; }
        public DateTime InquiryDate { get; set; }
    }
}
