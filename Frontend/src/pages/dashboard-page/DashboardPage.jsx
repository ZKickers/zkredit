import './DashboardPage.css'
import DashboardPageTemplate from 'templates/dashboard-page-template/DashboardPage.Template'
import Footer from 'components/organisms/footer/Footer'

export default function DashboardPage() {
    return <div className='dashboard-page'>
        <DashboardPageTemplate />
        <Footer />
    </div>
}