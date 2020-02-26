class DateFormater {
  toJQuery(format) {
    return format.toLowerCase().split('yy').join('y')
  }

  toStandard(JQueryFormat) {
    return JQueryFormat.toUpperCase().split('Y').join('YY')
  }
}

export default new DateFormater()
