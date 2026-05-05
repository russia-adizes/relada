import HeroBlock from '../components/dashboard/HeroBlock'
import InsightTabs from '../components/dashboard/InsightTabs'
import ProfileBlock from '../components/dashboard/ProfileBlock'
import NextStepBlock from '../components/dashboard/NextStepBlock'
import SecondaryOffers from '../components/dashboard/SecondaryOffers'

export default function Index() {
  return (
    <div className="space-y-4">
      <HeroBlock />
      <InsightTabs />
      <ProfileBlock />
      <NextStepBlock />
      <SecondaryOffers />
    </div>
  )
}
