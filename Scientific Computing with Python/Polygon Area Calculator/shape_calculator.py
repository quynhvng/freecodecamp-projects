class Rectangle:
    def __init__(self, width, height):
        self.__validate_input(width, height)
        self.width = width
        self.height = height
    
    def __str__(self):
        return "Rectangle(width={}, height={})".format(self.width, self.height)

    def __validate_input(self, *inputs):
        if any([not isinstance(input, int) or input <= 0 for input in inputs]):
            raise ValueError("Width and height should be positive integers.")

    def set_width(self, new_width):
        self.__validate_input(new_width)
        self.width = new_width

    def set_height(self, new_height):
        self.__validate_input(new_height)
        self.height = new_height

    def get_area(self):
        return self.width * self.height

    def get_perimeter(self):
        return 2 * (self.width + self.height)

    def get_diagonal(self):
        return (self.width ** 2 + self.height ** 2) ** 0.5

    def get_picture(self):
        if self.width > 50 or self.height > 50:
            return "Too big for picture."
        line = "*" * self.width + "\n"
        pic = ""
        for i in range(self.height):
            pic += line
        return pic
    
    def get_amount_inside(self, shape):
        "Return the number of times the input shape can fit in the original shape. Return None if input is invalid."
        if not isinstance(shape, Rectangle):
            print("Input shape should be a Rectangle.")
            return None
        n = 0
        if shape.width * shape.height != 0:
            w_fit = self.width // shape.width
            h_fit = self.height // shape.height
            n = w_fit * h_fit
        return n


class Square(Rectangle):
    def __init__(self, side_length):
        super().__init__(side_length, side_length)
    
    def __str__(self):
        return "Square(side={})".format(self.width)

    def set_side(self, new_side):
        self._Rectangle__validate_input(new_side)
        self.width = new_side
        self.height = self.width
    
    def set_width(self, new_width):
        self.set_side(new_width)

    def set_height(self, new_height):
        self.set_side(new_height)