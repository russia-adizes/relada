import HeroBlock from '../components/dashboard/HeroBlock'
import InsightTabs from '../components/dashboard/InsightTabs'
import AboutMe from './AboutMe'
import Partner from './Partner'
import Practice from './Practice'
import Methodology from './Methodology'

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 h-px bg-[#E8E4DC]" />
      <span className="text-[10px] font-semibold text-[#9E8B45] uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-[#E8E4DC]" />
    </div>
  )
}

export default function Index() {
  return (
    <div>
      <section id="home" className="space-y-4 pb-10">
        <HeroBlock />
        <InsightTabs />
      </section>

      <section id="about-me" className="pb-10">
        <SectionDivider label="Обо мне" />
        <div className="pt-4">
          <AboutMe />
        </div>
      </section>

      <section id="partner" className="pb-10">
        <SectionDivider label="С партнёром" />
        <div className="pt-4">
          <Partner />
        </div>
      </section>

      <section id="practice" className="pb-10">
        <SectionDivider label="Практика" />
        <div className="pt-4">
          <Practice />
        </div>
      </section>

      <section id="methodology" className="pb-10">
        <SectionDivider label="О методике" />
        <div className="pt-4">
          <Methodology />
        </div>
      </section>
    </div>
  )
}
