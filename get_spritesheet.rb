require 'sprite_factory'
require 'mini_magick'

def gen_spritesheet
  SpriteFactory.run!(
    './assets-src/images',
    :library => :chunkypng,
    :style => :scss,
    :layout => :packed,
    # :pngcrush => true,
    # :width => 100,
    # :height => 100,
    :nocomments => true,
    :output_image => './rb_sprite_crush.png',
    :output_style => './rb_sprite_crush.scss',
    :selector => '.sprite.'
  )
end

def convert
  dir = '/Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/'

  files = [
    'm2586.png',
    'm2591.png',
    'm2583.png',
    'm2584.png',
    'm2585.png',
    'm2582.png',
    'm2587.png',
    'm2588.png',
    'm2589.png',
    'm2590.png'
  ]

  files.each do |file|
    print "#{file}..."
    MiniMagick::Tool::Convert.new do |convert|
      # convert << "/Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2586.png"
      # convert << "#{dir}#{file}"
      # convert.resize("100x100")
      # convert << "./archieve/#{file}"
    end
    print "converted\n"
  end
end

gen_spritesheet


# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2586.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2591.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2583.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2584.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2585.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2582.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2587.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2588.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2589.png (128x128)
# /Users/maullerz/__projects/_my/mobile-toolz/assets-src/images/m2590.png (128x128)