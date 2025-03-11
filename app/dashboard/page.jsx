
import CourseList from './_components/CourseList'
import DashboardHeader from './_components/DashboardHeader'
import WelcomeBanner from './_components/WelcomeBanner'


function Dashboard() {
  return (
    
    <div className="flex-1 ">
      
      <WelcomeBanner />
      <CourseList />
      
    </div>
   
  )
}

export default Dashboard
