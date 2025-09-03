module Jekyll
  module ContainsFilter
	extend self
    def contains(input, test)
      input.include?(test).to_s()
	  #~ "#{input} contains #{test}? #{input.include?(test)}."
    end
  end
end

Liquid::Template.register_filter(Jekyll::ContainsFilter) if defined?(Liquid)
