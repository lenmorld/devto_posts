require

puts "=== __FILE__ ==="
puts __FILE__

puts "=== $LOAD_PATH ==="
puts $LOAD_PATH

puts "=== absolute path of file"
puts File.expand_path(File.dirname(FILE))
# puts "#{__FILE__}/#{$LOAD_PATH}"
