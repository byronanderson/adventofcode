
class Thing
  def self.transform(input)
    output = []
    sum = nil;
    offset = nil;
    templateIndex = nil;
    input.each_with_index do |el, index|
      sum = 0
      input.each_with_index do |el, i|
        offset = i + 1
        templateIndex = (offset / (index + 1)).floor % 4
        if templateIndex == 1
          sum += input[i]
        elsif templateIndex == 3
          sum -= input[i]
        end
      end
      output.push(sum.abs % 10)
    end
    output
  end

  def self.fft(input, phases, &messageOffset)
    value = input.strip().split("").map(&:to_i)
    i = 0
    while (i < phases)
      i += 1
      value = transform(value)
    end
    offset = yield value
    value.slice(offset, offset + 7).join("")
  end
end

#).slice(0, 8)).toEqual('24176176');
n = 10
puts Thing.fft(File.read('./input.txt') * n, 100) { |x| 0 }
# puts Thing.fft('12345678', 1) { |x| 0 }
#
go backwards??
