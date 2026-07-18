import BaseRepository from '../../src/repositories/base.repository';

// A fake Mongoose model: query methods return { exec } thenables
function fakeModel() {
  const exec = (value: any) => ({ exec: jest.fn().mockResolvedValue(value) });
  return {
    find: jest.fn().mockReturnValue(exec([{ _id: '1' }])),
    findById: jest.fn().mockReturnValue(exec({ _id: '1' })),
    findOne: jest.fn().mockReturnValue(exec(null)),
    create: jest.fn().mockResolvedValue({ _id: 'new' }),
    findByIdAndUpdate: jest.fn().mockReturnValue(exec({ _id: '1', updated: true })),
    findByIdAndDelete: jest.fn().mockReturnValue(exec({ _id: '1' })),
  };
}

describe('BaseRepository', () => {
  let model: any;
  let repo: BaseRepository<any>;

  beforeEach(() => {
    model = fakeModel();
    repo = new BaseRepository(model);
  });

  it('findAll passes the filter and resolves the exec value', async () => {
    await expect(repo.findAll({ status: 'available' })).resolves.toEqual([{ _id: '1' }]);
    expect(model.find).toHaveBeenCalledWith({ status: 'available' });
  });

  it('findAll defaults to an empty filter', async () => {
    await repo.findAll();
    expect(model.find).toHaveBeenCalledWith({});
  });

  it('findById resolves the document', async () => {
    await expect(repo.findById('1')).resolves.toEqual({ _id: '1' });
    expect(model.findById).toHaveBeenCalledWith('1');
  });

  it('findOne resolves null when nothing matches', async () => {
    await expect(repo.findOne({ email: 'x' })).resolves.toBeNull();
  });

  it('create delegates to model.create', async () => {
    await expect(repo.create({ a: 1 })).resolves.toEqual({ _id: 'new' });
    expect(model.create).toHaveBeenCalledWith({ a: 1 });
  });

  it('updateById uses { new: true }', async () => {
    await expect(repo.updateById('1', { a: 2 })).resolves.toEqual({ _id: '1', updated: true });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith('1', { a: 2 }, { new: true });
  });

  it('deleteById resolves the deleted document', async () => {
    await expect(repo.deleteById('1')).resolves.toEqual({ _id: '1' });
    expect(model.findByIdAndDelete).toHaveBeenCalledWith('1');
  });
});
