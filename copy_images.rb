require 'json'
require 'fileutils'

File.open("./assets-src/data/pieces.json","r") do |f|
  @tmp = JSON.parse(f.read(), symbolize_names: true)
end

arr = []
@tmp.each_with_index do |item, index|
  img_filename = item[:local_img_final].sub('/images/', '')
  unless img_filename.empty?
    # p "#{index}: #{img_filename}"
    arr << img_filename
  end
end

arr << "0.png"

IMGPATH = '../../phonegap-app/www/images/'

p "start copying #{arr.size} files"

FileUtils.cd('./assets-src/images')
begin
  FileUtils.mkdir(IMGPATH)
rescue
end
FileUtils.cp(arr, IMGPATH)

# p "pwd: #{Dir.pwd}"
count = Dir[File.join(IMGPATH, '**', '*')].count { |file| File.file?(file) }
p "Now #{count} files in IMG directory"
FileUtils.cd('../../')