json.project(@project,
  :id,
  :title,
  :slug,
  :status,
  :description,
  :due_date,
  :tactic,
  :target,
  :business_unit,
  :deliverables,
  :existing,
  :archive,
  :flag,
  :contact_id,
  :user_id,
  :translation,
  :reference,
  :created_at,
  :legal_review)

json.states(@states)
json.tactics(@tactics)
