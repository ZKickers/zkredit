import './DashboardPage.css'
import DashboardPageTemplate from 'templates/dashboard-page-template/DashboardPage.Template'
import Footer from 'components/organisms/footer/Footer'
import { sendProofStatus, useSendThreshold } from 'api/proofs.api'
import AuthContext from 'store/auth-context'
import { useContext } from 'react'
export default function DashboardPage() {
    const auth = useContext(AuthContext);

    // testThres(auth)
    // creditResponseTest(auth)
    return <div className='dashboard-page'>
        <DashboardPageTemplate />
        <Footer />
    </div>
}

// const testThres = async (auth) => {
//     const response = await sendThreshold({ token: auth.token, threshold: 800, txId: "65fd010f4e120358e07d0a4a" });
//     const proof = response.body
//     console.log(proof)
// }

const creditResponseTest = async (auth) => {
    const respone = await sendProofStatus("65f9fa5f090eea43c6ceef34", true, auth.token);
    console.log(respone);
}