import './DashboardPage.css'
import DashboardPageTemplate from 'templates/dashboard-page-template/DashboardPage.Template'
import Footer from 'components/organisms/footer/Footer'
import { sendProofStatus } from 'api/proofs.api'
import AuthContext from 'store/auth-context'
import { useContext } from 'react'
export default function DashboardPage() {
    const auth = useContext(AuthContext);

    
    return <div className='dashboard-page'>
        <DashboardPageTemplate />
        <Footer />
    </div>
}

const creditResponseTest = async (auth) => {
    const respone = await sendProofStatus("65f9fa5f090eea43c6ceef34",true,auth.token);
    console.log(respone);
}