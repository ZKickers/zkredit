import './DashboardPage.css'
import DashboardPageTemplate from 'templates/dashboard-page-template/DashboardPage.Template'
import Footer from 'components/organisms/footer/Footer'
import { sendThreshold } from 'api/proofs.api'
import AuthContext from 'store/auth-context'
import { useContext } from 'react'

export default function DashboardPage() {
    const auth = useContext(AuthContext);

    return <div className='dashboard-page'>
        <DashboardPageTemplate />
        <Footer />
    </div>
}

const testThres = async (auth) => {
    const response = await sendThreshold({ token: auth.token, threshold: 800, txId: "65fd010f4e120358e07d0a4a" });
    const proof = response.body
    console.log(proof)
}