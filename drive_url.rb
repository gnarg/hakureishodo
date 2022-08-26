#!/bin/env ruby

# https://drive.google.com/file/d/1DLi0Hah_Qh1tZ1XrUCIY8J1p9xImWld_/view?usp=sharing

ARGV[0] =~ /file\/d\/(.*)\/view/
file_id = $1

puts "https://drive.google.com/uc?id=#{file_id}&ext=.#{ARGV[1]}"

