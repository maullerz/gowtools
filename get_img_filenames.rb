require 'json'

File.open("./assets-src/data/pieces.json","r") do |f|
  @tmp = JSON.parse(f.read(), symbolize_names: true)
end

arr = []
@tmp.each_with_index do |item, index|
  img_filename = item[:local_img_final].sub('/images/', '')
  unless img_filename.empty?
    p "#{index}: #{img_filename}"
    arr << img_filename
  end
end

File.open("./img_filenames.json","w") do |f|
  f.write(JSON.pretty_generate(arr))
end