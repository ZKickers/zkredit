import PPTemplate from "templates/transactions-page-template/TransactionsPage.Template";
import "./TransactionsPage.css";
import Footer from "components/organisms/footer/Footer";

export default function TransactionsPage({isCreditor}) {
  return (
    <div className="proofs-page">
      <PPTemplate isCreditor={isCreditor}/>
      <Footer />
    </div>
  );
}
