import { translate } from '../utils/language';

export default function RecyclingTips({ onTabChange, language }) {
  const t = (text) => translate(text, language);
  const tips = [
    { number: '01', title: 'Know your bin', description: 'Check the label before you toss something. Keep paper, cardboard, cans, and accepted plastics in the recycling bin, and place food waste in the compost bin when available.' },
    { number: '02', title: 'Keep recyclables clean and dry', description: 'Empty containers and give them a quick rinse so food and drink residue does not contaminate an entire load. Flatten cardboard boxes to save space.' },
    { number: '03', title: 'Reuse before recycling', description: 'Choose a reusable bottle, mug, or shopping bag whenever you can. Reusing an item usually saves more energy and resources than processing it again.' },
  ];
  return (
    <section className="recycling-section" aria-labelledby="recycling-title">
      <div className="recycling-hero">
        <div className="recycling-hero-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 19h10" />
            <path d="M9 19V8h6v11" />
            <path d="M8 8h8" />
            <path d="M10 5h4" />
            <path d="M5 13a7 7 0 0 1 2-5" />
            <path d="m5 8 2 .5L6.5 11" />
            <path d="M19 13a7 7 0 0 1-2 5" />
            <path d="m19 18-2-.5.5-2.5" />
          </svg>
        </div>
        <div>
          <p className="section-eyebrow">{t('Campus sustainability')}</p>
          <h1 id="recycling-title">{t('Recycling Tips')}</h1>
          <p className="recycling-intro">{t('Small choices make a big difference. Use these quick tips to keep campus recycling clean, useful, and easy for everyone.')}</p>
        </div>
      </div>

      <div className="recycling-tips-grid">
        {tips.map((tip) => (
          <article className="recycling-tip-card" key={tip.number}>
            <span className="recycling-tip-number" aria-hidden="true">{tip.number}</span>
            <div>
              <h2>{t(tip.title)}</h2>
              <p>{t(tip.description)}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="recycling-help-card">
        <div>
          <h2>{t('See a recycling problem?')}</h2>
          <p>{t('Let the campus team know about a full bin, missing signage, or another facilities issue.')}</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => onTabChange('submit')}>
          {t('Submit a request')}
        </button>
      </div>
    </section>
  );
}
