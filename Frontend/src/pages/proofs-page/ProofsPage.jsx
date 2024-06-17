import PPTemplate from "templates/proofs-page-template/ProofsPage.Template";
import "./ProofsPage.css";
import Footer from "components/organisms/footer/Footer";

export default function ProofsPage({isCreditor}) {
  return (
    <div className="proofs-page">
      <PPTemplate isCreditor={isCreditor}/>
      <Footer />
    </div>
  );
}
