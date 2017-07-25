# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Create a root user to access full app
@admin = User.create(
  first_name: "Admin",
  last_name: "User",
  email: "coexdemo@gmail.com",
  password: "password"
)

@contact = Contact.create(
  first_name: "Devan",
  last_name: "Flaherty",
  email: "devanflaherty@gmail.com",
  phone: "480.388.1741",
  branch: "Salt Agency"
)

@contactConnie = Contact.create(
  first_name: "Connie",
  last_name: "Cermak",
  email: "connie@zoompop.com",
  phone: "444.333.7777",
  branch: "ZoomPop"
)

# Create an initial event for the home page
@event = Project.create(
  title: "Demo Project",
  slug: nil,
  contact_id: 2,
  user_id: 1,
  description: Faker::Lorem.paragraph(2),
  due_date: '',
  tactic: ['Flyer'],
  target: 'Main Demo',
  business_unit: 'CPR',
  existing: false,
  deliverables: 3,
  translation: false,
  reference: "http://saltagency.co",
  status: "Pending",
  flag: false,
  archive: false
)
