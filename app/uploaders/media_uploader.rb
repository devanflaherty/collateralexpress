class MediaUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  # include CarrierWave::RMagick
  include CarrierWave::MiniMagick

  add_config :ignore_integrity_errors
  add_config :ignore_processing_errors
  add_config :validate_integrity
  add_config :validate_processing

  if Rails.env.production?
    # AWS S3 storage on production, see config/initializers/carrierwave.rb
    storage :fog
  else
    # store locally for development and testing purposes
    storage :file
  end

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
  def store_dir
    "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
  end

  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url(*args)
  #   # For Rails 3.1+ asset pipeline compatibility:
  #   # ActionController::Base.helpers.asset_path("fallback/" + [version_name, "default.png"].compact.join('_'))
  #
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process scale: [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end
  version :thumb, if: :image? do
    puts "-------------------"
    process resize_to_fit: [300, 300]
  end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
  def extension_whitelist
    %w(pdf jpg jpeg gif png doc docx application/pdf)
  end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end
  protected

  def image?(new_file)
    new_file.content_type.start_with? 'image'
  end

  def pdf?(new_file)
    new_file.content_type.start_with? 'application'
  end

end
