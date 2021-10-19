class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    ['sort', 'page', 'limit', 'fields', 'or', 'orField', 'order'].forEach(
      (prop) => delete queryObj[prop]
    );

    if (queryObj?.price) {
      queryObj['price.single'] = queryObj.price;
      delete queryObj.price;
    }

    let queryStr = JSON.stringify(queryObj).replace(
      /\b(gte|gt|lte|lt|ne)\b/g,
      (match) => `$${match}`
    );
    console.log(queryStr, 2);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort(field, order) {
    console.log(field, order);
    if (this.queryString.sort) {
      console.log(this.queryString);
      const sortBy = this.queryString.sort
        .split(',')
        .map((field) => [field, parseInt(this.queryString?.order) || 1]);
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort([[field, order]]);
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  lean() {
    this.query = this.query.lean();
    return this;
  }

  or(fields) {
    if (this.queryString.or) {
      const query = { $or: [] };

      if (this.queryString?.orField) {
        this.queryString?.or
          ?.split(',')
          .forEach(
            (field) =>
              field && query.$or.push({ [this.queryString?.orField]: field })
          );
      } else {
        fields.forEach(
          (field) => field && query.$or.push({ [field]: this.queryString.or })
        );
      }
      this.query.find(query);
    }
    return this;
  }

  populate(field) {
    if (field) {
      this.query.populate(field);
    }
    return this;
  }
}

module.exports = APIFeatures;
