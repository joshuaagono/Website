import { NavBar } from "@/components/NavBar";

export default function DonationPage() {
  return (
    <>
      <NavBar />
      <main className="page donation">
        <h1>Donation and Payments</h1>
        <p>Plug in Stripe, Paystack, Flutterwave, or bank transfer while preserving finance access controls.</p>
        <form className="donation-form">
          <div className="amounts">
            {[25, 50, 100, 250].map((amount) => <button type="button" key={amount}>${amount}</button>)}
          </div>
          <label>Custom amount<input name="amount" type="number" min="1" defaultValue="100" /></label>
          <label>Fund<select name="fund"><option>Tithe</option><option>Offering</option><option>Missions</option><option>Building project</option><option>Welfare</option></select></label>
          <button className="primary">Continue to Payment</button>
        </form>
      </main>
    </>
  );
}
