-- Seed starter data for Viral Boss Planner

insert into businesses (name, niche) values
('Boss Prints Co', 'T-shirts, hoodies, mugs'),
('Cozy Home Drop', 'Rugs, blankets, tumblers'),
('Mom Money Digital', 'Canva templates, ebooks'),
('Fast Cash Local', 'Stuffed peppers, lemonade/slushies'),
('Career Glow Up', 'Resume/job tools'),
('Affiliate Finds Daily', 'Affiliate + product finds')
on conflict do nothing;

insert into money_goals (goal_name, target_amount, current_amount, due_date)
values ('Launch Tonight Goal', 1200, 0, current_date + interval '1 day')
on conflict do nothing;

insert into settings (brand_voice, default_hashtags, cta_templates, demo_mode)
values (
  'Confident, viral, motivational, cute but aggressive, mompreneur-friendly, beginner-friendly, and honest.',
  array['#Mompreneur', '#MakeMoneyTonight', '#SmallBusiness'],
  array['DM READY to order', 'Comment LINK and I will send details'],
  true
)
on conflict do nothing;

with categories as (
  select unnest(array[
    'T-shirts',
    'Hoodies',
    'Mugs',
    'Tumblers',
    'Rugs',
    'Blankets',
    'Canva templates',
    'Ebook',
    'Resume help',
    'Stuffed peppers',
    'Lemonade/slushies',
    'Affiliate products',
    'Dropshipping finds'
  ]) as category,
  row_number() over () as idx
),
platforms as (
  select unnest(array['tiktok','instagram','facebook','pinterest','youtube_shorts']) as platform,
  row_number() over () as idx
),
series as (
  select generate_series(1,55) as i
)
insert into content_templates (category, platform, hook, body, cta, hashtags)
select
  c.category,
  p.platform,
  'Stop scrolling: ' || c.category || ' can become tonight''s income stream (' || s.i || ').',
  'Here is the exact play: post proof, show the offer, add urgency, and tell people what to DM you for. Keep it simple and real.',
  'DM READY and I will send details.',
  array['#Mompreneur', '#SideHustle', '#MakeMoneyTonight', '#' || replace(c.category, ' ', '')]
from series s
join categories c on c.idx = ((s.i - 1) % 13) + 1
join platforms p on p.idx = ((s.i - 1) % 5) + 1;
