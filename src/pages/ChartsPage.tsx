import { ChartSection, ChartCard, ChartPlaceholder } from '../components/charts'

export const ChartsPage = () => {
  return (
    <div className="space-y-10">
      <ChartSection title="브랜드 분석">
        <ChartCard title="인기 커피 브랜드">
          <div className="grid grid-cols-2 gap-4">
            <ChartPlaceholder label="바 차트" />
            <ChartPlaceholder label="도넛 차트" />
          </div>
        </ChartCard>
        <ChartCard title="인기 스낵 브랜드">
          <div className="grid grid-cols-2 gap-4">
            <ChartPlaceholder label="바 차트" />
            <ChartPlaceholder label="도넛 차트" />
          </div>
        </ChartCard>
      </ChartSection>

      <ChartSection title="주간 트렌드">
        <ChartCard title="주간 기분 트렌드">
          <div className="grid grid-cols-2 gap-4">
            <ChartPlaceholder label="스택형 바 차트" />
            <ChartPlaceholder label="스택형 면적 차트" />
          </div>
        </ChartCard>
        <ChartCard title="주간 운동 트렌드">
          <div className="grid grid-cols-2 gap-4">
            <ChartPlaceholder label="스택형 바 차트" />
            <ChartPlaceholder label="스택형 면적 차트" />
          </div>
        </ChartCard>
      </ChartSection>

      <ChartSection title="생산성 분석">
        <ChartCard title="커피 섭취량 vs 생산성">
          <ChartPlaceholder label="멀티라인 차트" height="h-80" />
        </ChartCard>
        <ChartCard title="스낵 섭취 vs 사기">
          <ChartPlaceholder label="멀티라인 차트" height="h-80" />
        </ChartCard>
      </ChartSection>
    </div>
  )
}
