
namespace ATM.Domain.Exceptions
{
    public class CardBlockedException : DomainException
    {
        public CardBlockedException(string message) : base(message) { }
    }
}
