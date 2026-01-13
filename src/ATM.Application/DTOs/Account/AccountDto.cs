namespace ATM.Application.DTOs.Account
{
    public class AccountDto
    {
        public int Id { get; set; }
        public string AccountNumber { get; set; }
        public string CustomerName { get; set; }
        public decimal Balance { get; set; }
        public string Currency { get; set; }
        public string Status { get; set; }
    }
}
