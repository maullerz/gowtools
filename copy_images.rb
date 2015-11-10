# -*- encoding: utf-8 -*-

require 'fileutils'

def sync_dirs src_dir, dest_dir
  begin
    FileUtils.mkdir(dest_dir)
  rescue
  end

  source = Dir.entries(src_dir)
  dest = Dir.entries(dest_dir)

  diff = source - dest

  diff.map! { |f| "#{src_dir}#{f}" }

  diff.each do |file|
    p file
  end

  FileUtils.cp(diff, dest_dir)
end

sync_dirs("./assets-src/images/", "./phonegap-app/www/images/")
sync_dirs("./assets-src/icons/", "./phonegap-app/www/icons/")
sync_dirs("./assets-src/background/", "./phonegap-app/www/background/")
