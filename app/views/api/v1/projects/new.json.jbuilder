json.(@project,
  :id,
  :title,
  :slug,
  :status,
  :description,
  :due_date,
  :tactic,
  :target,
  :business_unit,
  :existing,
  :archive,
  :flag,
  :contact_id,
  :user_id)

json.states(@states)
json.tactics(@tactics)
